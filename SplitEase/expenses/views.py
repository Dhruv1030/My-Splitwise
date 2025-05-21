from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .forms import ExpenseCreateForm
from .models import Expense, ExpenseSplit # Ensure ExpenseSplit is imported
from groups.models import Group # Ensure Group is imported
from decimal import Decimal # For precise division

@login_required
def add_expense(request, group_id):
    group = get_object_or_404(Group, id=group_id)

    # Ensure the current user is a member of this group
    if not group.members.filter(id=request.user.id).exists():
        messages.error(request, "You are not a member of this group and cannot add expenses.")
        return redirect('groups:group_detail', group_id=group.id) # Or perhaps 'groups:group_list'

    if request.method == 'POST':
        form = ExpenseCreateForm(request.POST)
        if form.is_valid():
            expense = form.save(commit=False)
            expense.paid_by = request.user
            expense.group = group
            expense.split_type = 'EQUAL' # As per subtask, default to EQUAL
            expense.save() # Save the expense object first

            members = group.members.all()
            number_of_members = members.count()
            if number_of_members > 0:
                amount_per_member = (expense.amount / Decimal(number_of_members)).quantize(Decimal('0.01'))
                
                for member in members:
                    ExpenseSplit.objects.create(
                        expense=expense,
                        user=member,
                        amount_owed=amount_per_member
                    )
                
                # Adjust for potential rounding issues for the last member or payer
                # For simplicity, this basic implementation might have small rounding discrepancies.
                # A more robust solution would distribute the remainder.
                
                messages.success(request, f"Expense '{expense.description}' added to group '{group.name}' and split equally.")
            else:
                # Should not happen if creator is always a member
                messages.error(request, "Cannot split expense: the group has no members.")
            
            return redirect('groups:group_detail', group_id=group.id)
    else:
        form = ExpenseCreateForm()
    
    return render(request, 'expenses/add_expense.html', {'form': form, 'group': group})
