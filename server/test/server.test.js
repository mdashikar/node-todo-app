const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');
const jest = require('jest');

var {app} = require('./../server');
var {Todo} = require('./../models/todo');
var {Users} = require('./../models/users');
var {todos, users, populateUsers, populateTodos} = require('./seed/seed');


beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
    it('Should create a new todo', (done)=> {
        var text = 'test to text';

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect( (res) => {
                expect(res.body.text).toBe(text);
            })
            .end( (err, res) => {
                if(err){
                    return done(err);
                }
                Todo.find({text}).then( (todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch( (e)=> done(e));

            });
    });
    it('Should not creat with invalid body data', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if(err){
                    return done(err);
                }
                Todo.find().then( (todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch( (e) => done(e));
            })
    });
});

describe('GET /todos', () => {
    it('Should get all todos from Todo App', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    });
});
describe('GET /todos/:id', () => {
    it('Should return todos doc', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });
    it('Should return 404 if todo not found', (done) => {
        let hexId = new ObjectID().toHexString();
        request(app)
            .get(`/todos/${hexId}`)
            .expect(404)
            .end(done);
    });
    it('Should return 404 for non-object ids', (done) => {
        request(app)
            .get(`/todos/123avx`)
            .expect(404)
            .end(done);
    });
});
describe('DELETE /todos/:id', () => {
    it('Should remove a todo doc', (done) => {
        var hexId = todos[1]._id.toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(hexId);
            })
            .end((err, res) => {
                if(err){
                    return done(err);
                }
                Todo.findById(hexId).then((todo) => {
                    expect(todo).toBe(null);
                    done();
                }).catch( (e) => done(e));
            });
    });
    it('Should return 404 if todo not found', (done) => {
        let hexId = new ObjectID().toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .expect(404)
            .end(done);
    });
    it('Should return 404 for non-object ids', (done) => {
        request(app)
            .delete(`/todos/123avx`)
            .expect(404)
            .end(done);
    });
});

describe('PATCH /todos/:id', () => {
    it('Should update a todo doc', (done) => {
        var hexId = todos[0]._id.toHexString();
        var text = 'This is new text';
        request(app)
            .patch(`/todos/${hexId}`)
            .send({
                completed: true,
                text
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(true);
                expect(res.body.todo.completedAT).toBeA('number');
            })
            .end(done);
    });
    it('Should clear completedAT when todo is not completed', (done) => {
        var hexId = todos[1]._id.toHexString();
        var text = 'This is changed new text';
        request(app)
            .patch(`/todos/${hexId}`)
            .send({
                completed: false,
                text
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAT).toNotExist();
            })
            .end(done);
    });
});

describe('GET /users/me', () => {
    it('Should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });
    it('Should return 401 if not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });
});

describe('POST /users', () => {
    it('should create an user', (done) => {
        var email = 'exam@example.com';
        var password = '123mnb!';

        request(app)
            .post('/users')
            .send({email, password})
            .expect(200)
            .expect( (res) => {
                expect(res.headers['x-auth']).toBeTruthy();
                expect(res.body._id).toBeTruthy();
                expect(res.body.email).toBe(email);
            })
            .end((err) => {
                if(err){
                    return done(err);
                }
                Users.findOne({email}).then( (users) =>{
                    expect(users).toBeTruthy();
                    expect(users.password).not.toBe(password);
                    done();
                }).catch((e) => done(e));
            });
    });
    it('should return validation error if request invalid', (done) => {
        request(app)
            .post('/users')
            .send({
                email: 'and',
                password: '123'
            })
            .expect(400)
            .end(done)
            
    });
    it('should not create an user if email in use', (done) => {
        request(app)
            .post('/users')
            .send({
                email: 'mdashik@gmail.com',
                password: 'Passo123'
            })
            .expect(400)
            .end(done)
    });
});

describe('POST /users/login', () => {
    it('should check login and auth token', (done)=> {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: users[1].password
            })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeTruthy();
            })
            .end((err, res) => {
                if(err){
                    return done(err);
                }
                Users.findById(users[1]._id).then((users) => {
                    expect(users.tokens[0]).toContain({
                        _id: '59cf97b0be573212f0eda6f0',
                        access: 'auth',
                        token: res.headers['x-auth']
                    });
                    done();
                }).catch((e) => done(e));
            })
    });
    it('should check an invalid login', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: users[1].password + '23'
            })
            .expect(400)
            .expect( (res) => {
                expect(res.headers['x-auth']).toBeFalsy();
            })
            .end((err, res) => {
                if(err){
                    return done(err);
                }
                Users.findById(users[1]._id).then((users) => {
                    expect(users.tokens.length).toBe(0);
                    done();
                }).catch((e) => done(e));
            })
    });
});