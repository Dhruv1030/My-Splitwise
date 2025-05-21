from django import forms
from .models import Group

class GroupCreateForm(forms.ModelForm):
    class Meta:
        model = Group
        fields = ['name']

class AddMemberForm(forms.Form):
    username = forms.CharField(max_length=150, label="Username of member to add")
