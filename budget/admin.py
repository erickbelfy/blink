from django.contrib import admin
from budget.models import Budget 

class BudgetAdmin(admin.ModelAdmin):
    list_display = ('name', 'agency', 'email', 'phone', )

admin.site.register(Budget, BudgetAdmin)
