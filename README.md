# Budget vs Actuals Analyzer

Compares budget against actuals and produces a variance report in P&L order — by category, department, and account, with dollar and percent variance.

Live demo: https://bvaanalysis.vercel.app

## What it does
- Maps raw accounts to P&L lines (Revenue, COGS, OpEx, Other Income & Expense, Taxes)
- Computes dollar and percent variance per account, with an outer join so nothing is dropped
- Rolls results up to a category-level summary
- Exports a formatted Excel report
- Ships with sample data, so it runs out of the box with no setup

## How it's built
- Python engine (budget_variance_analyzer.py): a command-line tool that reads actuals and budget CSVs and writes an Excel report
- Web app: JavaScript / HTML / CSS front end with Clerk authentication and Supabase for per-user data isolation, deployed on Vercel

## Run the engine
python budget_variance_analyzer.py --actuals actuals.csv --budget budget.csv --output BvA_Report.xlsx

## Note
Prototype built on sample data. No client data included.
