from django.db import models
from django.contrib.auth.models import User
from groups.models import Group

class Expense(models.Model):
    group = models.ForeignKey(Group, related_name='expenses', on_delete=models.CASCADE)
    description = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    paid_by = models.ForeignKey(User, related_name='expenses_paid', on_delete=models.CASCADE)
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    SPLIT_TYPES = [
        ('EQUAL', 'Equal'),
        ('EXACT', 'Exact Amount'),
        ('PERCENTAGE', 'Percentage')
    ]
    split_type = models.CharField(max_length=10, choices=SPLIT_TYPES, default='EQUAL')

    def __str__(self):
        return f"{self.description} ({self.amount})"

class ExpenseSplit(models.Model):
    expense = models.ForeignKey(Expense, related_name='splits', on_delete=models.CASCADE)
    user = models.ForeignKey(User, related_name='expense_shares', on_delete=models.CASCADE)
    amount_owed = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.user.username} owes {self.amount_owed} for {self.expense.description}"
