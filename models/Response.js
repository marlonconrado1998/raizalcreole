module.exports = class ClassResponse {

    constructor(response) {
        this.response = response;
    }

    OK(data) {
        return this.response.status(200).json({
            status: 200,
            ok: true,
            status_message: 'Ejecución exitosa.',
            data
        });
    }

    SEND_FILE(file) {
        return this.response.sendFile(file);
    }

    BAD_REQUEST(error) {
        return this.response.status(400).json({
            ok: false,
            status_message: 'Error en la ejecucion.',
            error
        });
    }

    NOT_FOUND() {
        return this.response.status(200).json({
            status: 404,
            status_message: 'No encontrado.',
            data: null
        });
    }

    INTERNAL_SERVER() {
        return this.response.status(500).json({
            ok: false,
            status_message: 'Error interno del servidor.'
        });
    }
}