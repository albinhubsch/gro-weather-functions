import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

// Initiate admin
admin.initializeApp()

export const postNewMeasurement = functions.https.onRequest( async (request, response) => {

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
});

export const getLastMeasure = functions.https.onRequest( async (request, response) => {

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
});

export const getMeasuresFromLastDay = functions.https.onRequest( async (request, response) => {

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
});