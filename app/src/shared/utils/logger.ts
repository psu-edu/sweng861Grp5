import winston from "winston";

const colors = {
	error: "red",
	warn: "yellow",
	info: "green",
	http: "blue",
	debug: "white",
};

winston.addColors(colors);

const { combine, timestamp, printf, colorize, align, json } = winston.format;
const appVersion = process.env.npm_package_version;

const format = combine(
	colorize({ all: true }),
	timestamp({
		format: "YYYY-MM-DD hh:mm:ss A",
	}),
	align(),
	json(),
	printf(
		(info) =>
			`[${info.timestamp}] v: ${appVersion} ${info.level}: ${info.message}`,
	),
);

const transports = [
	new winston.transports.Console(),
	new winston.transports.File({
		filename: "logs/error.log",
		level: "error",
	}),
	new winston.transports.File({ filename: "logs/all.log" }),
];

export const logger = winston.createLogger({
	level: process.env.LOG_LEVEL || "info",
	format: format,
	transports: transports,
});
