from rest_framework.decorators import api_view
from rest_framework.response import Response

from ..services.dashboard_service import get_dashboard_summary


@api_view(['GET'])
def dashboard_summary(request):
    data = get_dashboard_summary()
    return Response(data)