const express = require('express');
let router = express.Router();

const regionController = require('../controllers/regionController');

router.route('/:username/getRegionByLanguage')
    .get((req, res) => {
        regionController.getRegionByLanguage(req, res);
    });

router.route('/:username/getRegionByLocation')
    .get((req, res) => {
        regionController.getRegionByLocation(req, res);
    });

router.route('/:username/getRegionByEmail')
    .get((req, res) => {
        regionController.getRegionByEmail(req, res);
    });

router.route('/:username/getRegionByWebsite')
    .get((req, res) => {
        regionController.getRegionByWebsite(req, res);
    });

router.route('/:username/getRegionByAll')
    .get((req, res) => {
        regionController.getRegionByAll(req, res);
    });

module.exports = router;