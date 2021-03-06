'use strict';

const Joi = require('joi');
const MongoModels = require('mongo-models');

class Experiment extends MongoModels {
  static create(name, description, userId, experimentalDesignId, callback) {

    const document = {
      name: name,
      description: description,
      userId: userId,
      experimentalDesignId: experimentalDesignId
    };

    this.insertOne(document, (err, docs) => {

      if (err) {
        return callback(err);
      }
      callback(null, docs[0]);
    });
  }
}


Experiment.collection = 'experiments';

Experiment.schema = Joi.object().keys({
  _id: Joi.object(),
  name: Joi.string().required(),
  description: Joi.string(),
  userId: Joi.string().required(),
  experimentalDesignId: Joi.string().required(),
  experimentalGroupIds: Joi.array().items(Joi.string()),
  parentExperimentId: Joi.string(),
  subExperimentIds: Joi.array().items(Joi.string())
});

Experiment.indexes = [
  {key: {userId: 1}}
];

module.exports = Experiment;

/*


 public ExperimentalGroup createExperimentalGroup(Set<Sample> samples) {
 ExperimentalGroup experimentalGroup = new ExperimentalGroup(samples);
 addExperimentalGroup(experimentalGroup);
 return experimentalGroup;
 }

 public void addExperimentalGroup(ExperimentalGroup experimentalGroup) {
 if (experimentalGroups == null) {
 experimentalGroups = new HashSet<ExperimentalGroup>();
 }
 experimentalGroups.add(experimentalGroup);
 }

 public void addSubExperiment(Experiment subExperiment) {
 if (subExperiments == null) {
 subExperiments = new HashSet<Experiment>();
 }
 subExperiments.add(subExperiment);
 }
 */
