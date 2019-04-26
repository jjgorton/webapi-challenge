const express = require('express');

const db = require('../data/helpers/projectModel');

const router = express.Router();

router.get('/', (req, res) => {
	db
		.get()
		.then((projects) => {
			res.status(200).json(projects);
		})
		.catch((err) => {
			res.status(500).json({ error: 'No!' });
		});
});

router.get('/:id/actions', (req, res) => {
	const projectId = req.params.id;
	db
		.getProjectActions(projectId)
		.then((project) => {
			console.log(project.length);
			if (project.length === 0) {
				res.status(404).json({ message: 'The project with the specified ID does not exist.' });
			} else {
				res.status(200).json(project);
			}
		})
		.catch((err) => {
			res.status(500).json({ error: "This project's actions could not be retrieved." });
		});
});

router.post('/', (req, res) => {
	const projectData = req.body;
	if (projectData.name && projectData.description) {
		db
			.insert(projectData)
			.then((project) => {
				res.status(201).json(project);
			})
			.catch((err) => {
				res.status(500).json({ error: 'There was an error while saving the project to the database' });
			});
	} else {
		res.status(400).json({ errorMessage: 'Please provide a project name and description.' });
	}
});

router.delete('/:id', (req, res) => {
	const projectId = req.params.id;
	db
		.remove(projectId)
		.then((project) => {
			if (!project) {
				res.status(404).json({ message: 'The project with the specified ID does not exist.' });
			} else {
				res.status(204).end();
			}
		})
		.catch((err) => {
			res.status(500).json({ error: 'The project could not be removed' });
		});
});

router.put('/:id', (req, res) => {
	const projectId = req.params.id;
	const projectData = req.body;

	if (!projectData.name || !projectData.description) {
		res.status(400).json({ errorMessage: 'Please provide a project name and description.' });
	} else {
		db
			.update(projectId, projectData)
			.then((project) => {
				if (!project) {
					res.status(404).json({ message: 'The project with the specified ID does not exist.' });
				} else {
					res.status(200).json(project);
				}
			})
			.catch((err) => {
				res.status(500).json({ error: 'The project information could not be modified.' });
			});
	}
});

module.exports = router;
