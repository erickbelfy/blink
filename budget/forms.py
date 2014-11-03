from django import forms

from budget.models import Budget 


class BudgetForm(forms.ModelForm):
    class Meta:
        model = Budget 
