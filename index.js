const express = require('express');
const app = express();
app.use(express.json());

let courses = [
    {id:1, name: "java"},
    {id:2, name: "javascript"},
    {id:3, name: "python"},
];
app.get('/courses',(req,res)=>{
    res.json(courses);
});

// POST request handler for /courses
app.post('/courses', (req, res) => {
    console.log(req.body);
    let singleCourse = {
        id: courses.length + 1,
        name : req.body.name
    }
    courses.push(singleCourse);
    res.send(courses);
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http:localhost:${PORT}`);
});