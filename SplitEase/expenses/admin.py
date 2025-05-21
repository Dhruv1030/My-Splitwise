from django.contrib import admin
from .models import Expense, ExpenseSplit

admin.site.register(Expense)
admin.site.register(ExpenseSplit)
