from django.urls import path

from .views import (
    CreateOrderView,
    VerifyPaymentView,
    AdminPaymentListView,
    AdminMarkPaymentPaidView,
)


urlpatterns = [

    path(
        "create-order/",
        CreateOrderView.as_view(),
        name="create-payment-order"
    ),

    path(
        "verify/",
        VerifyPaymentView.as_view(),
        name="verify-payment"
    ),

    path(
        "admin/",
        AdminPaymentListView.as_view(),
        name="admin-payment-list"
    ),

    path(
        "admin/<int:user_id>/mark-paid/",
        AdminMarkPaymentPaidView.as_view(),
        name="admin-mark-payment-paid"
    ),

]