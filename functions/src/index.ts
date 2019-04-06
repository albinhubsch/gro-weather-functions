import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as express from 'express';
import * as cors from 'cors'

const app = express();

// Initiate admin
admin.initializeApp()

export const postNewMeasurement = async (request: any, response: any) => {

    if(request.method !== "POST"){
        response.status(400).send('Please send a POST request');
        return null
    }

    let key = request.get('authorization');

    if( key !== functions.config()['gro36-weather'].key){
        response.status(401).send("Incorrect auth key")
        return null
    }

    const { temp, humidity } = request.body

    const db = admin.firestore()

    try {

        await db.collection('measurements').doc().set({
            humidity: humidity,
            temp: temp,
            metric: 'celcius',
            timestamp: admin.firestore.Timestamp.fromDate(new Date())
        })

        response.send("Measure saved!");

    } catch (error) {
        response.status(500).send("Could not save data")
    }

    return null
};

export const getLastMeasure = async (request: any, response: any) => {

    if(request.method !== "GET"){
        response.status(400).send('Invalid request type');
        return null
    }

    const db = admin.firestore()

    try {

        const measureRef = await db.collection('measurements')
        const query = await measureRef.orderBy('timestamp', 'desc').limit(1).get();
        const data: any[] = []

        query.forEach((doc)=>{
            data.push(doc.data())
        })

        response.send({data: data});

    } catch (error) {
        response.status(500).send("Could not get data")
    }

    return null
};

export const getMeasuresFromLastDay = async (request: any, response: any) => {

    if(request.method !== "GET"){
        response.status(400).send('Invalid request type');
        return null
    }

    const db = admin.firestore()

    try {

        const measureRef = await db.collection('measurements')
        const query = await measureRef.orderBy('timestamp', 'desc').limit(120).get();
        const data: any[] = []

        query.forEach((doc)=>{
            data.push(doc.data())
        })

        response.send({data: data});

    } catch (error) {
        response.status(500).send("Could not get data")
    }

    return null
};

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

// build multiple CRUD interfaces:
app.post('/postNewMeasurement', postNewMeasurement)
app.get('/getMeasuresFromLastDay', getMeasuresFromLastDay)
app.get('/getLastMeasure', getLastMeasure)

// Expose Express API as a single Cloud Function:
exports.weather_api = functions.https.onRequest(app);
