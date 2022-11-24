class Square {
    constructor(x, y, pieceOnThisSquare, canvasCoord) {
        this.x = x // Int 0 < x < 7
        this.y = y // Int 0 < y < 7 
        this.canvasCoord = canvasCoord
        this.pieceOnThisSquare = pieceOnThisSquare // ChessPiece || null
    }

    setPiece(newPiece) {
        if (newPiece === null && this.pieceOnThisSquare === null) {
            return
        } else if (newPiece === null) {
            // trường hợp mà người gọi hàm muốn loại bỏ phần nằm trên hình vuông này
            this.pieceOnThisSquare.setSquare(undefined)
            this.pieceOnThisSquare = null
        } else if (this.pieceOnThisSquare === null) {
            // trường hợp người gọi hàm muốn gán một phần mới trên hình vuông này
            this.pieceOnThisSquare = newPiece
            newPiece.setSquare(this)
        } else if (this.getPieceIdOnThisSquare() != newPiece.id && this.pieceOnThisSquare.color != newPiece.color) {
            // trường hợp mà người gọi hàm muốn thay đổi phần trên hình vuông này. (chỉ cho phép màu khác nhau)
            console.log("capture!")
            this.pieceOnThisSquare = newPiece
            newPiece.setSquare(this)
        } else {
            return "user tried to capture their own piece"
        }
    }

    removePiece() {
        this.pieceOnThisSquare = null
    }

    getPiece() {
        return this.pieceOnThisSquare 
    }

    getPieceIdOnThisSquare() {
        if (this.pieceOnThisSquare === null) {
            return "empty"
        }
        return this.pieceOnThisSquare.id
    }

    isOccupied() {
        return this.pieceOnThisSquare != null
    }

    getCoord() {
        return [this.x, this.y]
    }

    getCanvasCoord() {
        return this.canvasCoord
    }
}

export default Square