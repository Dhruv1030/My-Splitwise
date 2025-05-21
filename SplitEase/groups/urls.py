from django.urls import path
from . import views

app_name = 'groups' # Add app_name for namespacing

urlpatterns = [
    path('create/', views.create_group, name='create_group'),
    path('', views.group_list, name='group_list'), # Main page for groups app
    path('<int:group_id>/', views.group_detail, name='group_detail'),
    path('<int:group_id>/add_member/', views.add_member_to_group, name='add_member_to_group'),
]
