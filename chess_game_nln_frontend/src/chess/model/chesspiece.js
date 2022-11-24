class ChessPiece{
    constructor(name, isAttacked, color, id){
        this.name = name // string
        this.isAttacked = isAttacked // boolean
        this.color = color // string
        this.id = id // string
    }

    setSquare(newSquare){
        // thiết lập hình vuông mà mảnh này đang nằm trên cùng.
        // trên bất kỳ quân cờ nào (trên bàn cờ), sẽ luôn có một quân cờ nằm trên đó.
        if(newSquare === undefined){
            this.squareThisPieceIsOn = newSquare
            return
        }
        if (this.squareThisPieceIsOn === undefined) {
            this.squareThisPieceIsOn = newSquare
            newSquare.setPiece(this)
        }

        const isNewSquareDifferent = this.squareThisPieceIsOn.x !== newSquare.x || this.squareThisPieceIsOn.y !== newSquare.y

        if (isNewSquareDifferent) {
            this.squareThisPieceIsOn = newSquare
            newSquare.setPiece(this)
        }
    }
    getSquare() {
        return this.squareThisPieceIsOn
    }
}
export default ChessPiece