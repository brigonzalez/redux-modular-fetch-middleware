import Chance from 'chance'; // eslint-disable-line node/no-unpublished-import

import fetchMiddleware from '../src/index';

/* eslint-disable max-nested-callbacks */
describe('fetch middleware', () => {
    const chance = new Chance();

    let store,
        next,
        action,
        nextResponse,
        fetchImplementation;

    beforeEach(() => {
        store = {
            dispatch: jest.fn(),
            getState: jest.fn()
        };

        nextResponse = chance.string();
        next = jest.fn().mockReturnValue(nextResponse);

        action = {
            fetch: {
                onFailure: jest.fn(),
                onSuccess: jest.fn(),
                options: {
                    body: {
                        [chance.string()]: chance.string()
                    },
                    method: chance.word()
                },
                url: chance.url()
            },
            type: chance.string()
        };

        fetchImplementation = jest.fn().mockResolvedValue();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    const callMiddlewareCurry = () => fetchMiddleware(fetchImplementation)(store)(next)(action);

    describe('fetch implementation is not provided', () => {
        let fetchResponse;

        beforeEach(() => {
            fetchResponse = {
                headers: {
                    get: jest.fn()
                },
                json: jest.fn().mockResolvedValue({[chance.string()]: chance.string()})
            };

            window.fetch = jest.fn().mockResolvedValue(fetchResponse);
        });
        test('should call window.fetch', () => {
            fetchMiddleware()(store)(next)(action);

            expect(window.fetch).toHaveBeenCalledTimes(1);
            expect(window.fetch).toHaveBeenCalledWith(action.fetch.url, {
                ...action.fetch.options
            });
        });
    });

    describe('action does not have fetch property', () => {
        beforeEach(() => {
            delete action.fetch;
        });

        test('should call next', () => {
            callMiddlewareCurry();

            expect(next).toHaveBeenCalledTimes(1);
            expect(next).toHaveBeenCalledWith(action);
        });

        test('should return next call', () => {
            const middlewareResponse = callMiddlewareCurry();

            expect(middlewareResponse).toEqual(nextResponse);
        });
    });

    describe('action type is async and fetch', () => {
        let expectedData,
            fetchResponse;

        beforeEach(() => {
            expectedData = {
                [chance.string()]: chance.string()
            };

            fetchResponse = {
                headers: {
                    get: jest.fn()
                },
                json: jest.fn().mockResolvedValue(expectedData)
            };

            fetchImplementation.mockResolvedValue(fetchResponse);
        });

        test('should call next', () => {
            callMiddlewareCurry();

            expect(next).toHaveBeenCalledTimes(1);
            expect(next).toHaveBeenCalledWith(action);
        });

        describe('fetch call', () => {
            test('should call fetch', () => {
                callMiddlewareCurry();

                expect(fetchImplementation).toHaveBeenCalledTimes(1);
                expect(fetchImplementation).toHaveBeenCalledWith(action.fetch.url, {
                    ...action.fetch.options
                });
            });

            test('should not capture errors other fetch related', () => {
                const expectedErr = new Error();

                action.fetch.onSuccess.mockImplementationOnce(() => {
                    throw expectedErr;
                });

                expect(callMiddlewareCurry()).rejects.toBe(expectedErr);
            });

            describe('fetch call succeeds', () => {
                test('should fetch headers', async () => {
                    await callMiddlewareCurry();

                    expect(fetchResponse.headers.get).toHaveBeenCalledTimes(1);
                    expect(fetchResponse.headers.get).toHaveBeenCalledWith('content-type');
                });

                describe('onSuccess is a function', () => {
                    describe('content type is application/json', () => {
                        beforeEach(() => {
                            fetchResponse.headers.get.mockReturnValue(`application/json ${chance.word()}`);
                        });
                        test('should call success action', async () => {
                            await callMiddlewareCurry();

                            expect(action.fetch.onSuccess).toHaveBeenCalledTimes(1);
                            expect(action.fetch.onSuccess).toHaveBeenCalledWith(store.dispatch, store.getState, expectedData);
                        });
                    });

                    describe('content type is not application/json', () => {
                        test('should call success action', async () => {
                            await callMiddlewareCurry();

                            expect(action.fetch.onSuccess).toHaveBeenCalledTimes(1);
                            expect(action.fetch.onSuccess).toHaveBeenCalledWith(store.dispatch, store.getState);
                        });
                    });
                });

                describe('onSuccess is not a function', () => {
                    beforeEach(() => {
                        action.fetch.onSuccess = chance.string();
                    });

                    test('should not call success action', () => {
                        expect(callMiddlewareCurry()).resolves.not.toThrow();
                    });
                });
            });

            describe('fetch call fails', () => {
                let response,
                    err;

                beforeEach(() => {
                    response = {
                        [chance.word()]: chance.string()
                    };
                    err = new Error();
                    err.response = response;

                    fetchImplementation.mockRejectedValue(err);
                });

                test('should call error action', async () => {
                    await callMiddlewareCurry();

                    expect(action.fetch.onFailure).toHaveBeenCalledTimes(1);
                    expect(action.fetch.onFailure).toHaveBeenCalledWith(store.dispatch, store.getState, err);
                });

                describe('onError is not a function', () => {
                    beforeEach(() => {
                        action.fetch.onError = chance.string();
                    });

                    test('should not call error action', () => {
                        expect(callMiddlewareCurry()).resolves.not.toThrow();
                    });
                });
            });
        });
    });
});
/* eslint-enable */
