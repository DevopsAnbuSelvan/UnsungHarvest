"use client";

import { useForm } from "react-hook-form";
import { PublicLayout } from "@/components/layout/public-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast-context";
import { Mail, Phone, MapPin, Heart } from "lucide-react";

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
              { icon: Mail, label: "Email", value: "hello@unsungharvest.com" },
              { icon: Phone, label: "Phone", value: "+91 91504 92260" },
              { icon: MapPin, label: "Address", value: "Dindigul, Tamil Nadu, India" },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-4 glass-card rounded-2xl p-6">
                <item.icon className="h-6 w-6 text-primary shrink-0" />
                <div>
                  <p className="font-semibold">{item.label}</p>
                  <p className="text-muted-foreground">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-16 text-center text-sm text-muted-foreground">
          Made with{" "}
          <Heart className="inline h-4 w-4 text-red-500 fill-red-500 align-text-bottom" />{" "}
          by{" "}
          <a
            href="https://anbyte.in"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary hover:underline"
          >
            anbu
          </a>
        </p>
      </div>
    </PublicLayout>
  );
}
