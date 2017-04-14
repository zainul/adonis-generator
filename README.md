# adonis-generator

> :pray: Build Scaffold from yml schema for AdonisJs application.

This repo is use to build scaffold from schema.yml , including controller, models, view, and migration.

It includes generators for:

- Scaffold

The scaffold will be generated

- Controllers
- Models
- View
- Migrations

## Table of Contents

* [Team Members](#team-members)
* [Getting Started](#getting-started)

## <a name="team-members"></a>Team Members

* Zainul Masadi [Profile](http://github.com/zainul) <zainulmasadi90@gmail.com>

## <a name="getting-started"></a>Getting Started

```bash
npm i adonis-generator
```

after installing , you can create file name schema.yml to define schema. After it, you please added aceProvider in

open

```
bootstrap/app.js
```
add in aceProviders
```
---
'adonis-generator/providers/GeneratorsProvider',
---
```

add in commands

```
Adonis/Generators/Make:Scaffold
```


### Scaffold

```bash
./ace Scaffold YourSchema
```

### Example schema.yml

The basic schema is has 3 objects : name, fields, and relation. Each field has 2 object type and rules. type is type for field and rules is validation for the field , base on lucid ORM indicative validation.

```
name: box
fields:
  name_integer_field:
    type: integer
    rules: required|integer|above:18

  name_string_field:
    type: string|500
    rules: required|email|ends_with:.com

  name_text_field:
    type: text
    rules: required|alpha_numeric|max:5000

  name_float_field:
    type: float|5,2
    rules:

  name_decimal_field:
    type: decimal|5,2

  name_boolean_field:
    type: boolean
    rules: boolean

  name_date_field:
    type: date
    rules: date|after:2015-12-24|date_format:YYYY-MM-DD

  name_datetime_field:
    type: datetime
    rules: datetime

  name_time_field:
    type: time
    rules: time

  name_timestamp_field:
    type: timestamp

  name_json_field:
    type: json
    rules: json

  name_jsonb_field:
    type: jsonb

  name_enu_field:
    type: enu
    rules: array

  name_binary_field:
    type: binary
relation:
  - name:
    relationtype: belongsTo,
    relatedmodel: country,
    relatedcolumn: id,
    foreignkeys:
    extramethods:

```

###  if no relation don't add property relation in your schema or just write
```
relation:
  []
```


###  The output will be build

#### Migration

```
'use strict'

const Schema = use('Schema')

class BoxSchema extends Schema {

  up () {
    this.create('boxes', (table) => {
      table.increments()
        table.integer('integer_field')
        table.string('string_field', 500)
        table.text('text_field')
        table.float('float_field', 5,2)
        table.decimal('decimal_field', 5,2)
        table.boolean('boolean_field')
        table.date('date_field')
        table.datetime('datetime_field')
        table.time('time_field')
        table.timestamp('timestamp_field')
        table.json('json_field')
        table.jsonb('jsonb_field')
        table.enu('enu_field')
        table.binary('binary_field')

      table.timestamps()
    })
  }

  down () {
    this.drop('boxes')
  }

}

module.exports = BoxSchema


```

#### Model

```
'use strict'

const Lucid = use('Lucid')

class Box extends Lucid {

  static get table () {
    return 'boxes'
  }

  static get rules () {
    return {
      integer_field : 'required|integer|above:18' ,
      string_field : 'required|email|ends_with:.com' ,
      text_field : 'required|alpha_numeric|max:5000' ,
      float_field : '' ,
      decimal_field : '' ,
      boolean_field : 'boolean' ,
      date_field : 'date|after:2015-12-24|date_format:YYYY-MM-DD' ,
      datetime_field : 'datetime' ,
      time_field : 'time' ,
      timestamp_field : '' ,
      json_field : 'json' ,
      jsonb_field : '' ,
      enu_field : 'array' ,
      binary_field : ''  

    }
  }


}

module.exports = Box

```

#### Repository

will be generated repository

```
'use strict'

const Exceptions = use('App/Exceptions');

class BoxRepository {

  static get inject() {
    return ['App/Model/Box'];
  }

  constructor (Box) {
    this.Box = Box;
  }

  * find (id) {
    const box = yield this.Box.find(id);

    if (!box) {
      throw new Exceptions.ApplicationExceptions('Cannot find box with given id', 404)
    }

    return box
  }

  * all () {
    const boxes = yield this.Box.all();

    return boxes
  }

  * create (options) {
    const box = new this.Box(options);

    yield box.save()

    if (box.isNew()) {
      throw new Exceptions.ApplicationException('Unable to save box', 500)
    }

    return box
  }

  * update (id, options) {
    const box =  yield this.Box.find(id);

    for (var key in options) {
      box[key] = options[key];
    }

    yield box.save();

    return box
  }

  * delete (id) {

    const box = yield this.Box.find(id);

    yield box.delete();

    if (!box.isDeleted()) {
      throw new Exceptions.ApplicationException('Unable to delete box', 500)
    }

    return true
  }
}

module.exports = BoxRepository

```

#### Controller

```
'use strict'
const Validator = use('Validator');
const Box = use('App/Model/Box');
const BoxRepository = make('App/Repositories/Box');
const BaseController = require('./BaseController');

class BoxController extends BaseController {

  constructor() {
    super();
  }

  * index(request, response) {
    const boxes = yield Box.query().fetch();

    yield response.sendView('boxes.index', { boxes : boxes.toJSON() })
  }

  * create(request, response) {
    yield response.sendView('boxes.create', {} )
  }

  * store(request, response) {
    const postData = request.only('integer_field','string_field','text_field','float_field','decimal_field','boolean_field','date_field','datetime_field','time_field','timestamp_field','json_field','jsonb_field','enu_field','binary_field');
    const validation = yield Validator.validate(postData, Box.rules)

    if (validation.fails()) {
      yield request
       .withOnly('integer_field','string_field','text_field','float_field','decimal_field','boolean_field','date_field','datetime_field','time_field','timestamp_field','json_field','jsonb_field','enu_field','binary_field')
       .andWith({ errors: validation.messages() })
       .flash();

      response.redirect('back')
      return
    }

    const created = yield Box.create(postData);

    response.redirect('back');
  }

  * show(request, response) {
    const box = yield BoxRepository.find(request.param('id'))

    yield response.sendView('boxes.show',
      {
        box: box.toJSON()
      });
  }

  * edit(request, response) {
    const box = yield BoxRepository.find(request.param('id'))

    yield response.sendView('boxes.edit', { box: box.toJSON() })
  }

  * update(request, response) {
    const updatedData = request.only('integer_field','string_field','text_field','float_field','decimal_field','boolean_field','date_field','datetime_field','time_field','timestamp_field','json_field','jsonb_field','enu_field','binary_field');

    const validation = yield Validator.validate(updatedData, Box.rules)

    if (validation.fails()) {
      yield request
       .withOnly('integer_field','string_field','text_field','float_field','decimal_field','boolean_field','date_field','datetime_field','time_field','timestamp_field','json_field','jsonb_field','enu_field','binary_field')
       .andWith({ errors: validation.messages() })
       .flash();

      response.redirect('back')
      return
    }

    const box = yield BoxRepository.update(request.param('id'), updatedData)

    yield response.redirect('/boxes')
  }

  * destroy(request, response) {
    yield BoxRepository.delete(request.param('id'));

    yield response.redirect('/boxes');
  }
}

module.exports = BoxController

```
#### View

create
```
{% extends 'master' %}

{% block content %}
  <div>
    <h3>Create Box</h3>
    {{ form.open({action: 'BoxController.store', files:false }) }}

      {{ csrfField }}

      {% include "./field.njk" %}

      {{ form.submit('Save', 'save', { class: 'btn btn-success' }) }}

    {{ form.close() }}
  </div>
{% endblock %}

```

edit
```
{% extends 'master' %}

{% block content %}
  <div>
    <h3>Edit Box</h3>
    {{ form.open({action: 'BoxController.update', params: {id: box.id}, files:false  }) }}

    {{ csrfField }}

    {% include "./field.njk" %}

    {{ form.submit('Update', 'update', { class: 'btn btn-success' }) }}

  {{ form.close() }}
  </div>
{% endblock %}

```

field
```

  <fieldset class="form-group">
    {{ form.label('integer_field') }}
    {{ form.input('text', 'integer_field', box.integer_field, { class: 'form-control' }) }}
  </fieldset>

  <fieldset class="form-group">
    {{ form.label('string_field') }}
    {{ form.input('text', 'string_field', box.string_field, { class: 'form-control' }) }}
  </fieldset>

  <fieldset class="form-group">
    {{ form.label('text_field') }}
    {{ form.input('text', 'text_field', box.text_field, { class: 'form-control' }) }}
  </fieldset>

  <fieldset class="form-group">
    {{ form.label('float_field') }}
    {{ form.input('text', 'float_field', box.float_field, { class: 'form-control' }) }}
  </fieldset>

  <fieldset class="form-group">
    {{ form.label('decimal_field') }}
    {{ form.input('text', 'decimal_field', box.decimal_field, { class: 'form-control' }) }}
  </fieldset>

  <fieldset class="form-group">
    {{ form.label('boolean_field') }}
    {{ form.input('text', 'boolean_field', box.boolean_field, { class: 'form-control' }) }}
  </fieldset>

  <fieldset class="form-group">
    {{ form.label('date_field') }}
    {{ form.input('text', 'date_field', box.date_field, { class: 'form-control' }) }}
  </fieldset>

  <fieldset class="form-group">
    {{ form.label('datetime_field') }}
    {{ form.input('text', 'datetime_field', box.datetime_field, { class: 'form-control' }) }}
  </fieldset>

  <fieldset class="form-group">
    {{ form.label('time_field') }}
    {{ form.input('text', 'time_field', box.time_field, { class: 'form-control' }) }}
  </fieldset>

  <fieldset class="form-group">
    {{ form.label('timestamp_field') }}
    {{ form.input('text', 'timestamp_field', box.timestamp_field, { class: 'form-control' }) }}
  </fieldset>

  <fieldset class="form-group">
    {{ form.label('json_field') }}
    {{ form.input('text', 'json_field', box.json_field, { class: 'form-control' }) }}
  </fieldset>

  <fieldset class="form-group">
    {{ form.label('jsonb_field') }}
    {{ form.input('text', 'jsonb_field', box.jsonb_field, { class: 'form-control' }) }}
  </fieldset>

  <fieldset class="form-group">
    {{ form.label('enu_field') }}
    {{ form.input('text', 'enu_field', box.enu_field, { class: 'form-control' }) }}
  </fieldset>

  <fieldset class="form-group">
    {{ form.label('binary_field') }}
    {{ form.input('text', 'binary_field', box.binary_field, { class: 'form-control' }) }}
  </fieldset>


```

index
```
{% extends 'master' %}

{% block content %}
  <div>
    <br/>
    <a href="/boxes/create" class="btn btn-success">
      New Box
    </a>
    <br/><br/>
    <table class="table table-striped data-table">
      <thead>
        <tr>

            <td><b>integer_field</b></td>

            <td><b>string_field</b></td>

            <td><b>text_field</b></td>

            <td><b>float_field</b></td>

            <td><b>decimal_field</b></td>

            <td><b>boolean_field</b></td>

            <td><b>date_field</b></td>

            <td><b>datetime_field</b></td>

            <td><b>time_field</b></td>

            <td><b>timestamp_field</b></td>

            <td><b>json_field</b></td>

            <td><b>jsonb_field</b></td>

            <td><b>enu_field</b></td>

            <td><b>binary_field</b></td>

          <td><b>Action</b></td>
        </tr>
      </thead>
      {% for box in boxes %}
      <tr>

        <td>{{ box.integer_field }}</td>

        <td>{{ box.string_field }}</td>

        <td>{{ box.text_field }}</td>

        <td>{{ box.float_field }}</td>

        <td>{{ box.decimal_field }}</td>

        <td>{{ box.boolean_field }}</td>

        <td>{{ box.date_field }}</td>

        <td>{{ box.datetime_field }}</td>

        <td>{{ box.time_field }}</td>

        <td>{{ box.timestamp_field }}</td>

        <td>{{ box.json_field }}</td>

        <td>{{ box.jsonb_field }}</td>

        <td>{{ box.enu_field }}</td>

        <td>{{ box.binary_field }}</td>

      <td>
        {{ form.open({action: 'BoxController.destroy', method: 'DELETE',
         params: { id: box.id } }) }}
        <div class='btn-group'>
          {{ csrfField }}
          <a href="/boxes/{{ box.id }}" class="btn btn-info">
            <i class="fa fa-eye" aria-hidden="true"></i>
          </a>
          <a href="/boxes/{{ box.id }}/edit" class="btn btn-warning">
            <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
          </a>
          {{ form.button('X', 'delete', { class: 'btn btn-danger' }) }}
        <div>
        {{ form.close() }}
      </td>
      </tr>
      {% endfor %}
    </table>
  </div>
{% endblock %}

```


show
```
{% extends 'master' %}

{% block content %}
  <div>
    <h3>Show Task</h3>


      <fieldset class="form-group">
        <b>integer_field</b> : {{ box.integer_field }}
      </fieldset>

      <fieldset class="form-group">
        <b>string_field</b> : {{ box.string_field }}
      </fieldset>

      <fieldset class="form-group">
        <b>text_field</b> : {{ box.text_field }}
      </fieldset>

      <fieldset class="form-group">
        <b>float_field</b> : {{ box.float_field }}
      </fieldset>

      <fieldset class="form-group">
        <b>decimal_field</b> : {{ box.decimal_field }}
      </fieldset>

      <fieldset class="form-group">
        <b>boolean_field</b> : {{ box.boolean_field }}
      </fieldset>

      <fieldset class="form-group">
        <b>date_field</b> : {{ box.date_field }}
      </fieldset>

      <fieldset class="form-group">
        <b>datetime_field</b> : {{ box.datetime_field }}
      </fieldset>

      <fieldset class="form-group">
        <b>time_field</b> : {{ box.time_field }}
      </fieldset>

      <fieldset class="form-group">
        <b>timestamp_field</b> : {{ box.timestamp_field }}
      </fieldset>

      <fieldset class="form-group">
        <b>json_field</b> : {{ box.json_field }}
      </fieldset>

      <fieldset class="form-group">
        <b>jsonb_field</b> : {{ box.jsonb_field }}
      </fieldset>

      <fieldset class="form-group">
        <b>enu_field</b> : {{ box.enu_field }}
      </fieldset>

      <fieldset class="form-group">
        <b>binary_field</b> : {{ box.binary_field }}
      </fieldset>

  </div>
{% endblock %}

```
