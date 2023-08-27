import { Request, Response } from "express";

interface IPipeSetMarker {
    index: number;
    location: number;
}

let stage = new Array<IPipeSetMarker>();

function generateStage(count: number): void {
    for (let i = 0; i < count; i++) {
        stage.push({
            index: stage.length,
            location: Math.random(),
        });
    }
}

export class StageController {
    public static getStage(req: Request, res: Response): void {
        let startIndex = req.query.start as unknown as string & number;
        let endIndex = req.query.end as unknown as string & number;

        if (startIndex === undefined || endIndex === undefined) {
            res.status(400).send("Start and End must not be empty");
            return;
        }

        if (isNaN(startIndex) || isNaN(endIndex)) {
            res.status(400).send("Start and End must be number");
            return;
        }

        let startIndexNumber = parseInt(startIndex, 10);
        let endIndexNumber = parseInt(endIndex, 10);

        if (startIndexNumber > endIndexNumber) {
            res.status(400).send("Start must be greater than End");
            return;
        }

        if (stage.length < endIndexNumber) {
            generateStage(Math.abs(stage.length - endIndexNumber - 1));
        }

        res.status(200).json(stage.slice(startIndexNumber, endIndexNumber + 1));
    }
}
