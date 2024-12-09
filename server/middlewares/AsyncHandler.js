export const AsyncHandler = (theFunc)=> (req, res, next)=> {
    Promise.resolve(theFunc(req, res, next)).catch((err)=> next(err));
}