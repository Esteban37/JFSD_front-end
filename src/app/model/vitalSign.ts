import { Patient } from "./patient";

export class VitalSign {
    idVitalSign: number;
    patient: Patient;
    date: string;
    temperature: string;
    heartbeat: string;
    respiratoryRate: string;
}