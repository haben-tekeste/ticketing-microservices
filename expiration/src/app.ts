import {
  errorHandler,
  NotFoundError,
  currentUserMiddleware,
} from "@ht2ickets/common";
import {
  createTicketRouter,
  showTicketRouter,
  getAllTicketsRouter,
  updateTicketRouter,
} from "./routes";

const app = express();

app.set("proxy", true);
app.use(express.json());
app.use(
  cookieSession({
    // secure: true,
    signed: false,
  })
);

//
app.use(currentUserMiddleware);

// routes
app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(getAllTicketsRouter);
app.use(updateTicketRouter);

// 404 error
app.use("*", (req, res) => {
  throw new NotFoundError();
});

// handling errors
app.use(errorHandler);

export { app };
