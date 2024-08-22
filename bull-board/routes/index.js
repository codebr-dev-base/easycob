var express = require("express");
var router = express.Router();
const { createBullBoard } = require("@bull-board/api");
const { BullMQAdapter } = require("@bull-board/api/bullMQAdapter");
const { ExpressAdapter } = require("@bull-board/express");
const { Queue: QueueMQ, Worker } = require("bullmq");

const sleep = (t) => new Promise((resolve) => setTimeout(resolve, t * 1000));

const redisOptions = {
  port: 6379,
  host: "localhost",
  password: "",
  //tls: false,
};

const createQueueMQ = (name) => new QueueMQ(name, { connection: redisOptions });

async function setupBullMQProcessor(queueName) {
  new Worker(
    queueName,
    async (job) => {
      for (let i = 0; i <= 100; i++) {
        await sleep(Math.random());
        await job.updateProgress(i);
        await job.log(`Processing job at interval ${i}`);

        if (Math.random() * 200 < 1) throw new Error(`Random error ${i}`);
      }

      return { jobId: `This is the return value of job (${job.id})` };
    },
    { connection: redisOptions }
  );
}

const run = async () => {
  const ActionsOparationBullMq = createQueueMQ("ActionsOparation");
  const LoadCsvBullMq = createQueueMQ("LoadCsv");
  const ActionsEmailBullMq = createQueueMQ("ActionsEmail");
  const ActionsSmsBullMq = createQueueMQ("ActionsSms");
  const SendEmailBullMq = createQueueMQ("SendEmail");
  const SendSmsBullMq = createQueueMQ("SendSms");
  const SendInvoiceBullMq = createQueueMQ("SendInvoice");

  await setupBullMQProcessor(ActionsOparationBullMq.name);
  await setupBullMQProcessor(LoadCsvBullMq.name);
  await setupBullMQProcessor(ActionsEmailBullMq.name);
  await setupBullMQProcessor(ActionsSmsBullMq.name);
  await setupBullMQProcessor(SendEmailBullMq.name);
  await setupBullMQProcessor(SendSmsBullMq.name);
  await setupBullMQProcessor(SendInvoiceBullMq.name);

  const serverAdapter = new ExpressAdapter();
  serverAdapter.setBasePath("/");

  createBullBoard({
    queues: [
      new BullMQAdapter(ActionsOparationBullMq),
      new BullMQAdapter(LoadCsvBullMq),
      new BullMQAdapter(ActionsEmailBullMq),
      new BullMQAdapter(ActionsSmsBullMq),
      new BullMQAdapter(SendEmailBullMq),
      new BullMQAdapter(SendSmsBullMq),
      new BullMQAdapter(SendInvoiceBullMq),
    ],
    serverAdapter,
  });

  router.use("/", serverAdapter.getRouter());

  router.use("/add", (req, res) => {
    const opts = req.query.opts || {};

    if (opts.delay) {
      opts.delay = +opts.delay * 1000; // delay must be a number
    }

    ActionsOparationBullMq.add("Add", { title: req.query.title }, opts);
    LoadCsvBullMq.add("Add", { title: req.query.title }, opts);
    ActionsEmailBullMq.add("Add", { title: req.query.title }, opts);
    ActionsSmsBullMq.add("Add", { title: req.query.title }, opts);
    SendEmailBullMq.add("Add", { title: req.query.title }, opts);
    SendSmsBullMq.add("Add", { title: req.query.title }, opts);
    SendInvoiceBullMq.add("Add", { title: req.query.title }, opts);

    res.json({
      ok: true,
    });
  });
};
 
run().catch((e) => console.error(e));

module.exports = router;
