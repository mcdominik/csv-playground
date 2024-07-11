## Disclaimer
I reached the time limit and the app is not finished, but I decided to share what I did so far. 

## How to run 🚀


```bash
docker-compose up
```

Frontend should be running on port 5137.

## Description & Explanation

- The backend logic is relatively simple so I switched to FastAPI, which also support Celery out-of-the-box (I added Flower app for task monitoring);
- I used Ant Design to save some time on layout development;
- I added frontend container to docker-compose (Dockerfile with multi-stage builds);
- I decided to store csv content as string in db, because the task doesnt require comparing or searching through csv contents, but surely it's not optimal opproach. 

# TODO
- Create join function and properly connect the flow with Celery;
- Fix unprocesable entity error, while calling enrich endpoint;
- Improve user experience with loading compontents (eg. skeletons), toasts, extend error handling, add options to edit/remove fields;
- Fix poor UI/UX.
