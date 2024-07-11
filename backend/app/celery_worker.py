from celery import Celery
import time

celery = Celery("transformer", broker="redis://redis/0",
                backend="redis://redis/0")


@celery.task(name="app.worker.join_data")
def join_data():
    print('processing..')
    time.sleep(10)
    return 1
