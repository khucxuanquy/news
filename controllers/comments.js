const Comments = require('../models/comments')
const comment = new Comments()
const { resFail, resSuccess, convertDateTimeline } = require('../helpers')

module.exports = {
    async create(req, res) {
        const { id: user_id } = req.token
        const { post_id, content, reply_id_comment } = req.body
        if (!post_id || !content) return res.send(resFail({ message: 'thiếu post_id hoặc content' }))
        // neu comment la reply => position = 1
        let dataInput = {
            post_id,
            user_id,
            content,
        }
        // nếu reply id cha
        if (reply_id_comment) {
            dataInput.position = 1; // thay đổi vị trí ==> child
            dataInput.reply_id_comment = reply_id_comment;
            let { error: errGet, data: dataGet } = await comment.get({ conditions: { id: reply_id_comment }, fields: ['amount_child_comment'] })
            if (!(dataGet && dataGet.length)) return res.send(resFail({ message: errGet || 'Comment cha không tồn tại' }));
            await comment.edit({ id: reply_id_comment, amount_child_comment: dataGet[0].amount_child_comment += 1 })
        } else {
            dataInput.position = 0;
            dataInput.reply_id_comment = '';
        }
        let { error, data } = await comment.create(dataInput)
        delete data.user_id
        delete data.position
        data.dateCreated = convertDateTimeline(Number(data.dateCreated))
        if (error) return res.send(resFail({ error }))
        res.send(resSuccess({ data }))

    },
    async edit(req, res) {
        let { comment_id, content } = req.body
        if (!comment_id || !content) return res.send(resFail())
        let { error } = await comment.edit({ id: comment_id, content })
        if (error) return res.send(resFail({ error }))
        res.send(resSuccess())
    },
    async delete(req, res) {
        const { id: user_id } = req.token
        const { comment_id } = req.body
        let { error: errGet, data: dataGet } = await comment.get({ conditions: { id: comment_id }, fields: ['reply_id_comment'] })

        // if hơi thừa
        if (!(dataGet && dataGet.length)) return res.send(resFail({ message: errGet || 'Comment không tồn tại' }));

        // nếu là child
        if (dataGet[0].reply_id_comment) {
            comment.edit({ id: dataGet[0].reply_id_comment, amount_child_comment: dataGet[0].amount_child_comment -= 1 })
        }
        let { error } = await comment.deleteCommentOwner({ id: comment_id, user_id })
        if (error) return res.send(resFail({ error }))
        res.send(resSuccess())

    },
    async changeReaction(req, res) {
        let { comment_id, reaction } = req.body
        // reaction = -1 || 1
        reaction = Number(reaction) === 1 ? 1 : -1;
        let { error: errGet, data: dataGet } = await comment.get({ conditions: { id: comment_id }, fields: ['reaction'] })
        // neu khong get dc => comment khong ton tai
        if (!(dataGet && dataGet.length)) return res.send(resFail({ message: errGet || 'Comment không tồn tại' }));
        let { error } = await comment.edit({ id: comment_id, reaction: dataGet[0].reaction += reaction })
        if (error) return res.send(resFail({ error }))
        res.send(resSuccess())
    },
    async getComments(req, res) {
        let { post_id, limit, from, reply_id_comment } = req.query
        if (!post_id) return res.send(resFail({ message: "post_id không hợp lệ" }))
        from = Number(from) || 0
        if (limit && limit > 50) limit = 50
        limit = Number(limit) || 15

        let { error, data } = await comment.getComments({ post_id, limit, from, reply_id_comment })
        data = data.map(i => ({ ...i, dateCreated: convertDateTimeline(Number(i.dateCreated)) }))
        if (error) return res.send(resFail({ error }))
        res.send(resSuccess({ data }))
    },
    async getCommentsByIdUser(req, res) {
        let { limit, from } = req.query
        let { id } = req.token
        from = Number(from) || 0
        if (limit && limit > 50) limit = 50
        limit = Number(limit) || 15
        let { error, data } = await comment.getCommentsByIdUser({ id, limit, from })
        if (error) return res.send(resFail({ error }))
        data = data.map(i => ({ ...i, dateCreated: convertDateTimeline(Number(i.dateCreated)) }))
        res.send(resSuccess({data }))
    }
}