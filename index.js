const express = require('express');
const app = express();
app.use(express.json());
app.use(middleware);
app.use(logger);
const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, 'courses.json');

function readCourses() {
    try {
        const data = fs.readFileSync(dataFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading courses data:', error);
        return [];
    }
}

function writeCourses(courses) {
    try {
        fs.writeFileSync(dataFilePath, JSON.stringify(courses, null, 2), 'utf8');
    } catch (error) {
        console.error('Error writing courses data:', error);
    }
}

app.get('/courses',(req,res)=>{
    const courses = readCourses();
    res.json(courses);
});

// POST request handler for /courses
app.post('/courses', (req, res) => {
    console.log(req.body);
    const courses = readCourses();
    let newCourse = {
        id: courses.length + 1,
        name : req.body.name
    }
    courses.push(newCourse);
    writeCourses(courses);
    res.send(courses);
});

app.put('/courses/:id', (req, res) => {
    try{
        let courses = readCourses();
        let singleCourse = courses.find(course => course.id === parseInt(req.params.id));

        if(!singleCourse){
            res.status(404).send("course doesn't exist");
            return;
        }

        singleCourse.name = req.body.name;
        writeCourses(courses);
        res.send(courses);
    }
    catch{
        res.status(500).send(err);
    }
});

app.delete('/courses/:courseId', (req, res) => {
    let courses = readCourses();
    const courseId = parseInt(req.params.courseId);
    const courseIndex = courses.findIndex(c => c.id === courseId);

    if (courseIndex !== -1) {
        courses.splice(courseIndex, 1);
        writeCourses(courses);
        res.json({ data: courses });
    } else {
        res.status(404).send('Course not found');
    }
});


function middleware(req,res, next){
    console.log("called");
    next();
}

function logger(req, res, next){
    const method = req.method;
    const ip = req.ip;
    const hostname = req.hostname;
    const date = new Date();

    console.log("hey");
    console.log(`Method: ${method}, IP: ${ip}, Hostname: ${hostname}, Date: ${date}`);
    next();

}

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http:localhost:${PORT}`);
});


