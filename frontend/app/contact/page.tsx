"use client";

import { useForm } from "react-hook-form";
import { PublicLayout } from "@/components/layout/public-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast-context";
import { Mail, Phone, MapPin, Globe } from "lucide-react";

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const { toast } = useToast();
  const { register, handleSubmit, reset } = useForm<ContactForm>();

  const onSubmit = () => {
    toast({ title: "Message sent!", description: "We'll get back to you soon.", type: "success" });
    reset();
  };

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8 text-center">Contact Us</h1>
        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Send a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" {...register("name", { required: true })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" {...register("email", { required: true })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" {...register("subject", { required: true })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" rows={5} {...register("message", { required: true })} />
                </div>
                <Button type="submit" className="w-full">Send Message</Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {[
              { icon: Phone, label: "Phone", value: "72990 35015", href: "tel:7299035015" },
              { icon: Mail, label: "Email", value: "dindigul@velammalbodhicampus.com", href: "mailto:dindigul@velammalbodhicampus.com" },
              { icon: MapPin, label: "Address", value: "Kovilur, Mullipadi, Tamil Nadu 624005" },
              { icon: Globe, label: "Website", value: "vbcdindigul.com", href: "https://vbcdindigul.com/" },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-4 glass-card rounded-2xl p-6">
                <item.icon className="h-6 w-6 text-primary shrink-0" />
                <div>
                  <p className="font-semibold">{item.label}</p>
                  {"href" in item && item.href ? (
                    <a
                      href={item.href}
                      {...(item.href.startsWith("http")
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-muted-foreground">{item.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
