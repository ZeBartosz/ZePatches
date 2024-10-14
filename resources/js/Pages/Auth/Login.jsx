import { useForm } from "@inertiajs/react";

export default function Login() {
    const { data, setData, post, errors, processing } = useForm({
        email: "",
        password: "",
    });

    function submit(e) {
        e.preventDefault();
        post("/auth/login");
    }

    return (
        <>
            <h1 className="text-white">Register</h1>
            <div>
                <form onSubmit={submit}>

                    {/* Email */}
                    <div>
                        <label htmlFor="email">Email</label>
                        <input
                            type="text"
                            name="email"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            className={errors.email && "!ring-red-500"}
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={data.password}
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            className={errors.password && "!ring-red-500"}
                        />
                    </div>

                    <button disabled={processing}>
                        {processing ? "Creating Account..." : "Register"}
                    </button>
                </form>
            </div>
        </>
    );
}
