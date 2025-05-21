from django.urls import path
from . import views

app_name = 'expenses'

urlpatterns = [
    path('group/<int:group_id>/add/', views.add_expense, name='add_expense'),
]
