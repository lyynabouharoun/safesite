from ..models import Alert


def create_alert(obj_class, confidence, camera):
    return Alert.objects.create(
        type=obj_class,
        confidence=confidence,
        camera=camera
    )