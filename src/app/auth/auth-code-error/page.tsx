import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { AlertCircle } from "lucide-react"

export default function AuthCodeError() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                    <CardHeader className="text-center space-y-2">
                        <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                            <AlertCircle className="w-6 h-6 text-red-600" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-gray-900">Verification Failed</CardTitle>
                        <CardDescription className="text-gray-600">There was an issue verifying your email address</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-sm text-gray-600 space-y-2">
                            <p>This could happen if:</p>
                            <ul className="list-disc list-inside space-y-1 ml-2">
                                <li>The verification link has expired</li>
                                <li>The link has already been used</li>
                                <li>There was a network error</li>
                            </ul>
                        </div>
                        <div className="space-y-3">
                            <Button
                                asChild
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                            >
                                <Link href="/auth/signup">Try Signing Up Again</Link>
                            </Button>
                            <Button asChild variant="outline" className="w-full bg-transparent">
                                <Link href="/auth/login">Already have an account? Sign In</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
