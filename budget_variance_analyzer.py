import pandas as pd
import numpy as np
import argparse
from pathlib import Path

# Mapping dictionaries to categorize accounts into P&L lines
# In reality, this should be maintained in a mapping file or database.
ACCOUNT_MAPPING = {
    # Revenue
    'Product Revenue': 'Revenue',
    'Service Revenue': 'Revenue',
    'Subscription Revenue': 'Revenue',
    'Other Revenue': 'Revenue',
    
    # Cost of Goods Sold (COGS)
    'Direct Labor': 'COGS',
    'Materials': 'COGS',
    'Hosting & Infrastructure': 'COGS',
    'Software Licenses (Direct)': 'COGS',
    
    # Operating Expenses (OPEX)
    'Salaries & Wages': 'Operating Expenses',
    'Marketing & Advertising': 'Operating Expenses',
    'Rent & Utilities': 'Operating Expenses',
    'Software Subscriptions (Internal)': 'Operating Expenses',
    'Travel & Entertainment': 'Operating Expenses',
    'Legal & Professional Fees': 'Operating Expenses',
    
    # Other Income & Expenses
    'Interest Income': 'Other Income & Expense',
    'Interest Expense': 'Other Income & Expense',
    'Taxes': 'Taxes'
}

# The expected order of P&L categories in financial statements
CATEGORY_ORDER = {
    'Revenue': 1,
    'COGS': 2,
    'Operating Expenses': 3,
    'Other Income & Expense': 4,
    'Taxes': 5,
    'Uncategorized': 99
}

def categorize_account(account_name):
    """Categorize a given account into a P&L category."""
    # Simple mapping lookup, default to 'Uncategorized' if not found
    for key, category in ACCOUNT_MAPPING.items():
        if key.lower() in str(account_name).lower():
            return category
    return 'Uncategorized'

def generate_variance_report(actuals_path, budget_path, output_path='variance_report.xlsx'):
    """
    Reads actuals and budget files, processes them, and outputs an IPO-grade variance report.
    """
    print(f"Reading Actuals data from: {actuals_path}")
    print(f"Reading Budget data from: {budget_path}")
    
    try:
        # 1. Load Data
        df_actuals = pd.read_csv(actuals_path)
        df_budget = pd.read_csv(budget_path)
    except Exception as e:
        print(f"Error reading file: {e}")
        return
    
    # Ensure expected columns are present
    required_actuals = {'Month', 'Department', 'Account', 'Actual'}
    required_budget = {'Month', 'Department', 'Account', 'Budget'}
    
    if not required_actuals.issubset(df_actuals.columns):
        print(f"Error: Actuals file missing required columns. Expected at least {required_actuals}")
        return
    if not required_budget.issubset(df_budget.columns):
        print(f"Error: Budget file missing required columns. Expected at least {required_budget}")
        return

    # 2. Add P&L Category Mapping
    df_actuals['Category'] = df_actuals['Account'].apply(categorize_account)
    df_budget['Category'] = df_budget['Account'].apply(categorize_account)

    # 3. Aggregate for Full Year Result
    # Grouping by Category, Department, and Account (omitting Month for full year view)
    yearly_actuals = df_actuals.groupby(['Category', 'Department', 'Account'], as_index=False)['Actual'].sum()
    yearly_budget = df_budget.groupby(['Category', 'Department', 'Account'], as_index=False)['Budget'].sum()

    # 4. Merge Actuals and Budget Data
    # Merge using a full outer join to capture accounts that might only be in one file
    merged_df = pd.merge(
        yearly_budget, 
        yearly_actuals, 
        on=['Category', 'Department', 'Account'], 
        how='outer'
    )
    
    # Fill NA values with 0 for computation
    merged_df['Budget'] = merged_df['Budget'].fillna(0)
    merged_df['Actual'] = merged_df['Actual'].fillna(0)

    # 5. Calculate Variances
    # Standardizing variance logic: 
    # For Revenue, Actual > Budget is positive variance (favorable).
    # For Expenses, Actual > Budget is positive variance (unfavorable).
    # Depending on financial reporting standards, we compute $ Variance = Actual - Budget.
    
    merged_df['Dollar Variance ($)'] = merged_df['Actual'] - merged_df['Budget']
    
    # Percent Variance calculation (Actual - Budget) / Budget
    # Handle division by zero
    merged_df['Percent Variance (%)'] = np.where(
        merged_df['Budget'] != 0,
        (merged_df['Dollar Variance ($)'] / merged_df['Budget']) * 100,
        np.where(merged_df['Actual'] != 0, 100.0, 0.0) # 100% variance if budget is 0 but actuals exist
    )
    
    # 6. Formatting & Sorting (IPO Level presentation)
    merged_df['Category_SortOrder'] = merged_df['Category'].map(CATEGORY_ORDER).fillna(99)
    merged_df = merged_df.sort_values(by=['Category_SortOrder', 'Department', 'Account']).drop(columns=['Category_SortOrder'])
    
    # Organize columns
    columns_order = [
        'Category',
        'Department',
        'Account',
        'Budget',
        'Actual',
        'Dollar Variance ($)',
        'Percent Variance (%)'
    ]
    report_df = merged_df[columns_order]

    # Save to Excel with formatting
    try:
        report_df.to_excel(output_path, index=False, float_format="%.2f")
        print(f"\nSuccessfully generated IPO-grade Variance Report: {output_path}")
        print("\n--- Summary Preview ---")
        
        # Output summary roll-up by Category
        summary_df = report_df.groupby('Category')[['Budget', 'Actual', 'Dollar Variance ($)']].sum()
        print(summary_df.to_markdown())
        
    except Exception as e:
        print(f"Error saving report: {e}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Budget vs Actuals Analyzer")
    parser.add_argument("--actuals", default="actuals.csv", help="Path to Actuals CSV file")
    parser.add_argument("--budget", default="budget.csv", help="Path to Budget CSV file")
    parser.add_argument("--output", default="BvA_Report.xlsx", help="Path to Output Excel file")
    
    args = parser.parse_args()
    
    # To run this script without real data, creating dummy files temporarily
    actuals = Path(args.actuals)
    budget = Path(args.budget)
    
    if not actuals.exists() or not budget.exists():
        print(f"Note: Standard test files '{args.actuals}' and '{args.budget}' not found.")
        print("Generating dummy sample data to demonstrate functionality...")
        
        # Dummy data generation
        df_a = pd.DataFrame({
            'Month': ['Jan-25', 'Jan-25', 'Feb-25', 'Feb-25'],
            'Department': ['Sales', 'R&D', 'Sales', 'R&D'],
            'Account': ['Subscription Revenue', 'Salaries & Wages', 'Subscription Revenue', 'Salaries & Wages'],
            'Actual': [110000, 55000, 115000, 52000]
        })
        df_b = pd.DataFrame({
            'Month': ['Jan-25', 'Jan-25', 'Feb-25', 'Feb-25'],
            'Department': ['Sales', 'R&D', 'Sales', 'R&D'],
            'Account': ['Subscription Revenue', 'Salaries & Wages', 'Subscription Revenue', 'Salaries & Wages'],
            'Budget': [100000, 50000, 110000, 50000]
        })
        
        df_a.to_csv('actuals.csv', index=False)
        df_b.to_csv('budget.csv', index=False)
        
        generate_variance_report('actuals.csv', 'budget.csv', args.output)
    else:
        generate_variance_report(args.actuals, args.budget, args.output)
