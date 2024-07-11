from celery import Celery
import time
celery = Celery('transformer', broker='redis://redis/0',
                backend='redis://redis/0')


@celery.task(name='app.worker.process_some_task')
def process_some_task(device_token: str):
    time.sleep(10)
    print('ok')
    # with open("notification.log", mode="a") as notification_log:
    #     response = f"Successfully sent push notification to: {device_token}\n"
    #     notification_log.write(response)
