import { useForm } from "@inertiajs/react";

export default function Register() {
    const { data, setData, post, errors, processing } = useForm({
        username: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    function submit(e) {
        e.preventDefault();
        post("/auth/register");
    }

    return (
        <>
            <h1 className="text-white">Register</h1>
            <div>
                <form onSubmit={submit}>
                    {/* Username */}
                    <div>
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={data.username}
                            onChange={(e) =>
                                setData("username", e.target.value)
                            }
                            className={errors.username && "!ring-red-500"}
                        />
                    </div>

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

                    {/* Password Confirmation  */}
                    <div>
                        <label htmlFor="password_confirmation">
                            Password Confirmation
                        </label>
                        <input
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            onChange={(e) =>
                                setData("password_confirmation", e.target.value)
                            }
                            className={
                                errors.password_confirmation && "!ring-red-500"
                            }
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
