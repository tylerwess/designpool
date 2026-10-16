import { Button } from "@/components/ui/Button";
import { controlClassName } from "@/components/ui/Field";

/** Landing search: submits straight to /jobs with the same q and location params the filters use. */
export function HeroSearch() {
  return (
    <form
      action="/jobs"
      method="get"
      role="search"
      aria-label="Search design roles"
      className="flex flex-col gap-2 sm:flex-row"
    >
      <label className="min-w-0 flex-[3]">
        <span className="sr-only">Title or company</span>
        <input
          type="search"
          name="q"
          placeholder="Title or company"
          className={controlClassName}
        />
      </label>
      <label className="min-w-0 flex-[2]">
        <span className="sr-only">Location</span>
        <input
          type="search"
          name="location"
          placeholder="City, country, or remote"
          className={controlClassName}
        />
      </label>
      <Button type="submit" className="w-full shrink-0 sm:w-auto">
        Search roles
      </Button>
    </form>
  );
}
