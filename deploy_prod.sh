#!/bin/bash

# =====================================================
# Production Deployment Script
# =====================================================
# This script deploys the latest changes to production
# by merging the main branch into the prod branch.
# The prod branch is connected to Vercel for automatic
# deployment when changes are pushed.
#
# Usage: sh deploy_prod.sh
# =====================================================

# Switch to the production branch
git checkout prod

# Merge the latest changes from main into prod
git merge -m "Merge main into prod" main

# Push the updated prod branch to trigger Netlify deployment
git push -u origin prod

# Switch back to main branch for continued development
git checkout main

