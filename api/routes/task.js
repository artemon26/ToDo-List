const express = require('express'),
    router = express.Router(),
    config = require('config'),
    fs = require('file-system'),
    shortId = require('shortid');

router.post('/api/task', (req, res) => {
    const data = JSON.parse(fs.readFileSync(config.get('jsonTasks'), 'utf8')),
        task = req.body;

    task.id = shortId.generate();
    task.description = task.description.trim() || 'No Description';
    task.status = 'In Progress';

    data.push(task);
    fs.writeFileSync(config.get('jsonTasks'), JSON.stringify(data));

    res.send(task);
});


router.get('/api/task/:id', (req, res) => {
    const data = JSON.parse(fs.readFileSync(config.get('jsonTasks'), 'utf8')),
        task = data.find(task => task.id === req.params.id);

    task ? res.send(task) : res.send({});
});

router.put('/api/task/:id', (req, res) => {
    const data = JSON.parse(fs.readFileSync(config.get('jsonTasks'), 'utf8')),
        task = data.find(task => task.id === req.params.id),
        updatedTask = req.body;

    task.title = updatedTask.title;
    task.description = updatedTask.description || 'No Description';

    fs.writeFileSync(config.get('jsonTasks'), JSON.stringify(data));

    res.sendStatus(204);
});

router.put('/api/task/:id/done', (req, res) => {
    const data = JSON.parse(fs.readFileSync(config.get('jsonTasks'), 'utf8'));

    data.find(task => task.id === req.params.id).status = 'Done';

    fs.writeFileSync(config.get('jsonTasks'), JSON.stringify(data));

    res.sendStatus(204);
});

router.delete('/api/task/:id', (req, res) => {
    const data = JSON.parse(fs.readFileSync(config.get('jsonTasks'), 'utf8')),
        updatedData = data.filter(task => task.id !== req.params.id);

    fs.writeFileSync(config.get('jsonTasks'), JSON.stringify(updatedData));

    res.sendStatus(204);
});

module.exports = router;