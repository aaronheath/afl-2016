import {Injectable} from '@angular/core';
import {Model} from './model';
import {Item} from './item';

class VenueItem extends Item {}

class VenueModel extends Model {
    protected fillable = [
        'id',
        'fullName',
        'abbreviation',
        'city',
        'state',
        'timezone',
    ];
}

const model = new VenueModel(VenueItem);

export default model;
