const { test, expect } = require("playwright/test");
const{ log } = require("console");
const{ Ajv } = require("ajv");
const ajv = new Ajv();


// GET
test('Test Case 1', async ({ request }) => {

    const response = await request.get('https://reqres.in/api/unknown');
    console.log(response.status());
    console.log(await response.json());
    });


// POST
test('Test Case 2', async ({ request }) => {
    const bodyData = 
    {
        "name": "morpheus",
        "job": "leader"
    }

    const headerData = 
    {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }

    const response = await request.post('https://reqres.in/api/users',{
    headers: headerData,
    data: bodyData
    });
    console.log(response.status());
    console.log(await response.json());
});

// DELETE
test('Test Case 3', async ({ request }) => {

    const response = await request.delete('https://reqres.in/api/users/2');
    console.log(response.status());

    const responseBody = await response.text()
    expect(responseBody).toBe('')

    console.log("Status code:", response.status())
    console.log("Response body:", responseBody || "No Content")
    
});

// PUT/UPDATE

test('Test Case 4', async ({ request }) => {

    const bodyData = 
    {
        "name": "morpheus",
        "job": "zion resident"
    }

    const headerData = 
    {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }

    const response = await request.put('https://reqres.in/api/users/2',{
    headers: headerData,
    data: bodyData
    });
    console.log(response.status());
    console.log(await response.json());
});

// Assertion
// GET

test('Test Case 5', async ({ request }) => {

    const response = await request.get('https://reqres.in/api/unknown');
    expect(response.status()).toBe(200)

    const responseData = await response.json()

    
    expect(responseData.page).toBeDefined()
    expect(responseData.per_page).toBeDefined()
    expect(responseData.total).toBeDefined()
    expect(responseData.total_pages).toBeDefined()

    expect(responseData.data).toBeInstanceOf(Array)
    expect(responseData.data.length).toBeGreaterThan(0)

    const firstItem = responseData.data[0];
    expect(firstItem.id).toBeDefined();
    expect(firstItem.name).toBeDefined();
    expect(firstItem.year).toBeDefined();
    expect(firstItem.color).toBeDefined();
    expect(firstItem.pantone_value).toBeDefined();

    const valid = ajv.validate(require('./jsonschematest/get-schema-list-resource.json'), responseData)

    if (!valid) {
        console.log("AJV Validation Errors:", ajv.errorsText())
    }
    expect(valid).toBe(true)
});

// Assertion
// POST

test('Test Case 6', async ({ request }) => {

    const postData = {
        name: "morpheus",
        job: "leader"
    };

    const response = await request.post('https://reqres.in/api/users',{
    data : postData
    });

    expect(response.status()).toBe(201)

    const responseData = await response.json()

    expect(responseData).toHaveProperty('name', 'morpheus');
    expect(responseData).toHaveProperty('job', 'leader');
    expect(responseData).toHaveProperty('id');
    expect(responseData).toHaveProperty('createdAt');

    const valid = ajv.validate(require('./jsonschematest/post-schema.json'), responseData)

    if (!valid) {
        console.log("AJV Validation Errors:", ajv.errorsText())
    }
    expect(valid).toBe(true)
});

// PUT
// Assertion

test('Test Case 7', async ({ request }) => {

    const putData = {
        name: "morpheus",
        job: "zion resident"
    };

    const response = await request.put('https://reqres.in/api/users/2',{
    data : putData
    });

    expect(response.status()).toBe(200)

    const responseData = await response.json()

    expect(responseData).toHaveProperty('name', 'morpheus');
    expect(responseData).toHaveProperty('job', 'zion resident');
    expect(responseData).toHaveProperty('updatedAt');

    const valid = ajv.validate(require('./jsonschematest/put-schema.json'), responseData)

    if (!valid) {
        console.log("AJV Validation Errors:", ajv.errorsText())
    }
    expect(valid).toBe(true)
});

// DELETE
// Assertion

test('Test Case 8', async ({ request }) => {

    const response = await request.delete('https://reqres.in/api/users/2');
    
    expect(response.status()).toBe(204);

    const responseBody = await response.body();
    expect(responseBody.length).toBe(0);

    
});