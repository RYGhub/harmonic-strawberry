import {connect} from "./discord"


const main = async () => {
    await connect()
}


main().finally(
    () => {
        console.warn("Main has exited.")
    }
)
