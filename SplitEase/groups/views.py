from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib import messages
from .forms import GroupCreateForm, AddMemberForm
from .models import Group, GroupMembership

@login_required
def create_group(request):
    if request.method == 'POST':
        form = GroupCreateForm(request.POST)
        if form.is_valid():
            group = form.save(commit=False)
            group.created_by = request.user
            group.save()
            # Automatically add the creator as a member
            GroupMembership.objects.create(user=request.user, group=group)
            # Redirect to a placeholder or a future group detail page
            # For now, let's assume a 'group_list' URL name exists or will be created.
            # If not, this will need adjustment. A safer bet for now might be redirecting to welcome.
            return redirect('groups:group_detail', group_id=group.id)
    else:
        form = GroupCreateForm()
    return render(request, 'groups/create_group.html', {'form': form})

@login_required
def group_list(request):
    groups = Group.objects.filter(members=request.user)
    return render(request, 'groups/group_list.html', {'groups': groups})

@login_required
def group_detail(request, group_id):
    group = get_object_or_404(Group, id=group_id)
    # Ensure the request.user is a member of this group
    if not group.members.filter(id=request.user.id).exists():
        # Optional: Add a message using django.contrib.messages
        # messages.error(request, "You do not have permission to view this group.")
        return redirect('groups:group_list') # Redirect to group list if not a member
    
    members = group.members.all() 
    expenses = group.expenses.all().order_by('-date') # Fetch expenses
    return render(request, 'groups/group_detail.html', {'group': group, 'members': members, 'expenses': expenses})

@login_required
def add_member_to_group(request, group_id):
    group = get_object_or_404(Group, id=group_id)

    # Security Check: Only group creator can add members
    if request.user != group.created_by:
        messages.error(request, "You do not have permission to add members to this group.")
        return redirect('groups:group_detail', group_id=group.id)

    if request.method == 'POST':
        form = AddMemberForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            try:
                user_to_add = User.objects.get(username=username)
                if group.members.filter(id=user_to_add.id).exists():
                    messages.warning(request, f"User {username} is already a member of this group.")
                else:
                    GroupMembership.objects.create(user=user_to_add, group=group)
                    messages.success(request, f"User {username} added to the group {group.name}.")
            except User.DoesNotExist:
                messages.error(request, f"User {username} does not exist.")
            return redirect('groups:group_detail', group_id=group.id)
    else:
        form = AddMemberForm()
    
    return render(request, 'groups/add_member.html', {'form': form, 'group': group})
