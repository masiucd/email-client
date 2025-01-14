import {Box, Button, Flex, type FlexProps} from "@radix-ui/themes";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import type {PropsWithChildren, ReactNode} from "react";

import {H5, P, Span} from "@/_components/typography";
import {getUserFromSession} from "@/lib/auth";
import {appTheme} from "@/lib/config";

export default function MainLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className="my-5 flex min-h-[calc(100dvh-12rem)] flex-col">
        {children}
      </main>
      <Footer />
    </>
  );
}

async function Header() {
  let userFromSession = await getUserFromSession();
  return (
    <header className="bg-gray-50 shadow">
      <Wrapper justify="between">
        <Box>
          <H5>
            <Span color={appTheme.accentColor} weight="bold">
              Task
            </Span>{" "}
            <Span color="gray" weight="bold">
              Manager
            </Span>
          </H5>
        </Box>
        {userFromSession ? (
          <form
            action={async () => {
              "use server";
              let cookieStore = cookies();
              cookieStore.delete("session");
              redirect("/");
            }}
          >
            <Button variant="ghost" type="submit">
              Logout
            </Button>
          </form>
        ) : null}
      </Wrapper>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-50 shadow">
      <Wrapper>
        <P asChild size="2">
          <small>
            © {new Date().getFullYear()}{" "}
            <Span color={appTheme.accentColor} weight="bold">
              Task
            </Span>{" "}
            <Span color="gray" weight="bold">
              Manager
            </Span>
          </small>
        </P>
      </Wrapper>
    </footer>
  );
}

function Wrapper(props: PropsWithChildren<FlexProps>) {
  return (
    <Flex
      height="5rem"
      className="mx-auto max-w-6xl"
      align="center"
      px="3"
      {...props}
    >
      {props.children}
    </Flex>
  );
}
