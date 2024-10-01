import Navigation from "@/app/ui/navigation/Navigation";


export default function registration() {

    return (
        <main>
            <div className="container px-4 py-5 text-center">
                <h1 className="display-5 text-body-emphasis">
                Davidson Laboratory SFAS Registration
                </h1>

            </div>
            <div className="flex">
                <div className=" border  w-50 flex-none">
                    <p>Hi</p>
                </div>
                <div className=" text-center  border  w-50 flex-1 ">
                    <p>Hi</p>
                    <form action="">
                        <input name="verificationCode" required/>
                        <button type="submit">Search</button>
                    </form>
                </div>
            </div>
        </main>
    );
}