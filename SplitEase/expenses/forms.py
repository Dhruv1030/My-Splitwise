from django import forms
from .models import Expense

class ExpenseCreateForm(forms.ModelForm):
    class Meta:
        model = Expense
        fields = ['description', 'amount', 'date'] # As per step 3

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['date'].widget = forms.DateInput(attrs={'type': 'date'})
