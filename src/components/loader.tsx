import { Brain } from 'lucide-react'
import { Card, CardContent } from './ui/card'

export default function Loader({page, text}: {page?: string ,text?: string}) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-8">
                <CardContent className="text-center">
                    <Brain className="w-16 h-16 mx-auto mb-4 text-blue-400 animate-pulse" />
                    <h2 className="text-2xl font-bold text-white mb-2">Loading {page}</h2>
                    <p className="text-gray-300">{text}</p>
                </CardContent>
            </Card>
        </div>
    )
}