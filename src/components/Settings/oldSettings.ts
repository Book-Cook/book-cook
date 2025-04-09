// import * as React from "react";
// import { makeStyles, shorthands, mergeClasses } from "@griffel/react";
// import {
//   tokens,
//   Divider,
//   Input,
//   Dropdown,
//   Option,
//   Spinner,
//   Button,
//   Radio,
//   RadioGroup,
//   Avatar,
//   Text,
// } from "@fluentui/react-components";
// import { PersonDeleteRegular } from "@fluentui/react-icons";
// import { useSession, signOut } from "next-auth/react";
// import { Unauthorized } from "../FallbackScreens";
// import { useTheme } from "../../context";
// import type { ThemePreference } from "../../context";
// import {
//   useShareWithUser,
//   useDeleteSharedUser,
//   useSharedUsers,
// } from "../../clientToServer";

// const useStyles = makeStyles({
//   page: {
//     maxWidth: "800px",
//     margin: "0 auto",
//     padding: "24px",
//   },
//   card: {
//     ...shorthands.padding("24px"),
//     ...shorthands.borderRadius("12px"),
//     backgroundColor: tokens.colorNeutralBackground1,
//     boxShadow: tokens.shadow8,
//     display: "flex",
//     flexDirection: "column",
//     gap: "32px",
//   },
//   section: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "24px",
//   },
//   title: {
//     fontSize: tokens.fontSizeBase600,
//     fontWeight: tokens.fontWeightSemibold,
//     color: tokens.colorNeutralForeground1,
//     margin: 0,
//   },
//   settingGroup: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "16px",
//   },
//   setting: {
//     display: "flex",
//     flexWrap: "wrap",
//     alignItems: "center",
//     justifyContent: "space-between",
//     gap: "16px",
//   },
//   info: {
//     flex: "1 1 300px",
//     display: "flex",
//     flexDirection: "column",
//     gap: "4px",
//   },
//   label: {
//     fontSize: tokens.fontSizeBase300,
//     fontWeight: tokens.fontWeightSemibold,
//     color: tokens.colorNeutralForeground1,
//   },
//   description: {
//     fontSize: tokens.fontSizeBase200,
//     color: tokens.colorNeutralForeground2,
//   },
//   control: {
//     width: "250px",
//     flexShrink: 0,
//     "@media (max-width: 710px)": {
//       width: "100%",
//     },
//   },
//   colorInput: {
//     height: "32px",
//     minWidth: "40px",
//     cursor: "pointer",
//   },
//   signOutButton: {
//     backgroundColor: tokens.colorPaletteRedBackground1,
//     color: tokens.colorPaletteRedForeground1,
//     alignSelf: "flex-end",
//     transition: "all 0.2s ease",
//     ":hover": {
//       backgroundColor: tokens.colorPaletteRedBackground2,
//       color: tokens.colorPaletteRedForeground1,
//       transform: "translateY(-1px)",
//     },
//   },
//   usersList: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "8px",
//     marginTop: "16px",
//     width: "100%",
//   },
//   userItem: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     ...shorthands.padding("8px", "12px"),
//     ...shorthands.borderRadius("6px"),
//     backgroundColor: tokens.colorNeutralBackground2,
//   },
//   userInfo: {
//     display: "flex",
//     alignItems: "center",
//     gap: "8px",
//   },
//   emptyState: {
//     fontSize: tokens.fontSizeBase200,
//     color: tokens.colorNeutralForeground3,
//     fontStyle: "italic",
//     ...shorthands.padding("8px", "0"),
//   },
//   statusMessage: {
//     marginTop: "8px",
//     fontSize: "12px",
//   },
//   successMessage: {
//     color: tokens.colorPaletteGreenForeground1,
//   },
//   errorMessage: {
//     color: tokens.colorPaletteRedForeground1,
//   },
// });

// export const SettingsPage = () => {
//   const styles = useStyles();
//   const { data: session, status } = useSession();
//   const { themePreference, setThemePreference, primaryColor, setPrimaryColor } =
//     useTheme();

//   const [defaultServings, setDefaultServings] = React.useState("4");
//   const [unitSystem, setUnitSystem] = React.useState("imperial");

//   const { data: sharedUsers = [], isLoading } = useSharedUsers();
//   const shareRecipeMutation = useShareWithUser();
//   const removeAccessMutation = useDeleteSharedUser();

//   const [shareEmail, setShareEmail] = React.useState("");

//   const [shareResult, setShareResult] = React.useState<{
//     status: "success" | "error" | null;
//     message: string;
//   }>({ status: null, message: "" });

//   // Event handlers
//   const handlePrimaryColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setPrimaryColor(e.target.value);
//   };

//   const handleThemePreferenceChange = (
//     _: React.FormEvent<HTMLDivElement>,
//     data: { value: string }
//   ) => {
//     setThemePreference(data.value as ThemePreference);
//   };

//   const handleShareRecipeBook = async () => {
//     if (!shareEmail) return;

//     try {
//       await shareRecipeMutation.mutateAsync(shareEmail);
//       setShareResult({
//         status: "success",
//         message: "Recipe book shared successfully!",
//       });
//       setShareEmail("");
//     } catch (error) {
//       setShareResult({
//         status: "error",
//         message:
//           error instanceof Error
//             ? error.message
//             : "Failed to share recipe book",
//       });
//     }
//   };

//   const handleRemoveAccess = async (email: string) => {
//     if (!confirm(`Remove access for ${email}?`)) {
//       return;
//     }

//     try {
//       await removeAccessMutation.mutateAsync(email);
//       setShareResult({
//         status: "success",
//         message: `Access for ${email} has been removed.`,
//       });
//     } catch (error) {
//       setShareResult({
//         status: "error",
//         message:
//           error instanceof Error ? error.message : "Failed to remove access",
//       });
//     }
//   };

//   const isSharing =
//     shareRecipeMutation?.isPending || removeAccessMutation?.isPending;

//   // Loading and authentication states
//   if (status === "loading") return <Spinner label="Loading settings..." />;
//   if (!session) return <Unauthorized />;

//   return (
//     <div className={styles.page}>
//       <div className={styles.card}>
//         {/* Appearance Section */}
//         <section className={styles.section}>
//           <h2 className={styles.title}>Appearance</h2>
//           <div className={styles.settingGroup}>
//             {/* Theme Selection */}
//             <div className={styles.setting}>
//               <div className={styles.info}>
//                 <div className={styles.label}>Theme</div>
//                 <div className={styles.description}>
//                   Choose the application theme or follow system preference.
//                 </div>
//               </div>
//               <RadioGroup
//                 layout="horizontal"
//                 value={themePreference}
//                 onChange={handleThemePreferenceChange}
//                 className={styles.control}
//               >
//                 <Radio value="light" label="Light" />
//                 <Radio value="dark" label="Dark" />
//                 <Radio value="system" label="System" />
//               </RadioGroup>
//             </div>
//             <Divider />

//             {/* Primary Color Selection */}
//             <div className={styles.setting}>
//               <div className={styles.info}>
//                 <div className={styles.label}>Primary Color</div>
//                 <div className={styles.description}>
//                   Choose the main accent color used throughout the app.
//                 </div>
//               </div>
//               <Input
//                 className={mergeClasses(styles.control, styles.colorInput)}
//                 type="color"
//                 value={primaryColor}
//                 onChange={handlePrimaryColorChange}
//                 appearance="filled-darker"
//                 aria-label="Select primary color"
//               />
//             </div>
//           </div>
//         </section>

//         {/* Recipe Preferences Section */}
//         <section className={styles.section}>
//           <h2 className={styles.title}>Recipe Preferences</h2>
//           <div className={styles.settingGroup}>
//             {/* Unit System Selection */}
//             <div className={styles.setting}>
//               <div className={styles.info}>
//                 <div className={styles.label}>Default Unit System</div>
//                 <div className={styles.description}>
//                   Choose measurement system for recipes.
//                 </div>
//               </div>
//               <Dropdown
//                 className={styles.control}
//                 value={unitSystem === "imperial" ? "US Imperial" : "Metric"}
//                 appearance="filled-darker"
//                 onOptionSelect={(_, data) => {
//                   setUnitSystem(
//                     data.optionValue === "imperial" ? "imperial" : "metric"
//                   );
//                 }}
//               >
//                 <Option value="imperial">US Imperial</Option>
//                 <Option value="metric">Metric</Option>
//               </Dropdown>
//             </div>
//             <Divider />

//             {/* Default Servings Setting */}
//             <div className={styles.setting}>
//               <div className={styles.info}>
//                 <div className={styles.label}>Default Servings</div>
//                 <div className={styles.description}>
//                   Default servings for new recipes.
//                 </div>
//               </div>
//               <Input
//                 className={styles.control}
//                 value={defaultServings}
//                 onChange={(e) => setDefaultServings(e.target.value)}
//                 type="number"
//                 min="1"
//                 appearance="filled-darker"
//                 aria-label="Default servings"
//               />
//             </div>
//           </div>
//         </section>

//         {/* Recipe Sharing Section */}
//         <section className={styles.section}>
//           <h2 className={styles.title}>Share Recipe Book</h2>
//           <div className={styles.settingGroup}>
//             {/* Share with User */}
//             <div className={styles.setting}>
//               <div className={styles.info}>
//                 <div className={styles.label}>Share with Another User</div>
//                 <div className={styles.description}>
//                   Enter an email address to share your recipe book with another
//                   user.
//                 </div>
//                 {shareResult.status && (
//                   <div
//                     className={mergeClasses(
//                       styles.statusMessage,
//                       shareResult.status === "success"
//                         ? styles.successMessage
//                         : styles.errorMessage
//                     )}
//                   >
//                     {shareResult.message}
//                   </div>
//                 )}
//               </div>
//               <div
//                 style={{ display: "flex", gap: "8px" }}
//                 className={styles.control}
//               >
//                 <Input
//                   value={shareEmail}
//                   onChange={(e) => setShareEmail(e.target.value)}
//                   placeholder="user@example.com"
//                   type="email"
//                   appearance="filled-darker"
//                   style={{ flexGrow: 1 }}
//                   disabled={isSharing}
//                 />
//                 <Button
//                   onClick={handleShareRecipeBook}
//                   disabled={!shareEmail || isSharing}
//                 >
//                   {isSharing ? <Spinner size="tiny" /> : "Share"}
//                 </Button>
//               </div>
//             </div>

//             {/* Users with Access */}
//             <div
//               className={styles.setting}
//               style={{ flexDirection: "column", alignItems: "flex-start" }}
//             >
//               <div className={styles.info}>
//                 <div className={styles.label}>Users with Access</div>
//                 <div className={styles.description}>
//                   These users can view all your recipes.
//                 </div>
//               </div>
//               <div className={styles.usersList}>
//                 {isLoading ? (
//                   <Spinner size="tiny" label="Loading shared users..." />
//                 ) : sharedUsers.length > 0 ? (
//                   sharedUsers.map((email) => (
//                     <div key={email} className={styles.userItem}>
//                       <div className={styles.userInfo}>
//                         <Avatar
//                           name={email.split("@")[0]}
//                           size={24}
//                           color="colorful"
//                         />
//                         <Text>{email}</Text>
//                       </div>
//                       <Button
//                         icon={<PersonDeleteRegular />}
//                         appearance="subtle"
//                         size="small"
//                         onClick={() => handleRemoveAccess(email)}
//                         title="Remove access"
//                         aria-label={`Remove ${email}'s access`}
//                         disabled={isSharing}
//                       />
//                     </div>
//                   ))
//                 ) : (
//                   <div className={styles.emptyState}>
//                     You haven't shared your recipes with anyone yet.
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Account Settings Section */}
//         <section className={styles.section}>
//           <h2 className={styles.title}>Account Settings</h2>
//           <div className={styles.setting}>
//             <div className={styles.info}>
//               <div className={styles.label}>Sign Out</div>
//               <div className={styles.description}>
//                 End your current session.
//               </div>
//             </div>
//             <Button
//               className={styles.signOutButton}
//               onClick={() => signOut()}
//               aria-label="Sign out of account"
//             >
//               Sign Out
//             </Button>
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// };
