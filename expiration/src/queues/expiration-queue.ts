import Bull from "bull"

interface Payload{
    orderId: string,
}

const expirationQueue = new Bull<Payload>("order.expiration",{
    redis: {
        host: process.env.REDIS_HOST
    }
});

expirationQueue.process(async (job) => {
    console.log("Processing job with order id: ", job.data.orderId);
})

export {expirationQueue}